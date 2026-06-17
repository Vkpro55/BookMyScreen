import WebSocket from "ws";
import type { RawData, WebSocketServer } from "ws";
import { MessageSchema } from "../types/socket.types.js";
import redis from "../config/redis.js";

/* eslint-disable no-console */

const rooms = new Map<string, Set<WebSocket>>();

// // Periodically clean up expired locks from the Redis "locked-seats:<showId>" set
// // and notify connected clients about released seats.
// const CLEANUP_INTERVAL_MS = 30_000; // 30 seconds

// async function cleanupExpiredLocks() {
//   try {
//     for (const showId of rooms.keys()) {
//       const lockedSeatsKey = `locked-seats:${showId}`;
//       const seatIds = await redis.smembers(lockedSeatsKey);

//       const expired: string[] = [];

//       for (const seatId of seatIds) {
//         const seatLockKey = `seat-lock:${showId}:${seatId}`;
//         const exists = await redis.get(seatLockKey);
//         if (!exists) {
//           expired.push(seatId);
//         }
//       }

//       if (expired.length > 0) {
//         await redis.srem(lockedSeatsKey, ...expired);

//         const payload = JSON.stringify({
//           type: "seat-unlocked",
//           showId,
//           seatIds: expired,
//         });

//         const room = rooms.get(showId);
//         if (room) {
//           room.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//               client.send(payload);
//             }
//           });
//         }
//       }
//     }
//   } catch (err) {
//     console.error("Error during expired lock cleanup", err);
//   }
// }

// setInterval(() => {
//   void cleanupExpiredLocks();
// }, CLEANUP_INTERVAL_MS);

type SocketWithShowId = WebSocket & { showId?: string };

export const socketHandlers = (socket: WebSocket, _server: WebSocketServer) => {
  socket.on("message", (raw: RawData) => {
    void (async () => {
      try {
        // Parse raw data safely
        let parsed: unknown;
        try {
          if (typeof raw === "string") {
            parsed = JSON.parse(raw);
          } else if (raw instanceof Buffer) {
            parsed = JSON.parse(raw.toString("utf8"));
          } else if (Array.isArray(raw)) {
            parsed = JSON.parse(Buffer.concat(raw).toString("utf8"));
          } else if (raw instanceof ArrayBuffer) {
            parsed = JSON.parse(Buffer.from(raw).toString("utf8"));
          } else {
            return;
          }
        } catch {
          return;
        }

        console.log("Parsed Data is:", parsed);

        // Validate with Zod
        const msg = MessageSchema.parse(parsed);

        switch (msg.type) {
          /**
           * USER JOINS A SHOW ROOM
           * ----------------------
           * When a user opens the seat layout page,
           * we send all currently locked seats.
           */
          case "join-show": {
            const { showId } = msg;
            let room = rooms.get(showId);

            if (!room) {
              room = new Set();
              rooms.set(showId, room);
            }

            room.add(socket);
            (socket as SocketWithShowId).showId = showId;

            console.log(`User joined room: ${showId}`);

            /**
             * Fetch all locked seats from Redis SET and validate each
             * against the per-seat lock key. Remove any stale entries
             * (where the seat-lock:<showId>:<seatId> key has expired)
             * so UI won't show seats that are no longer locked.
             */
            const lockedSeatsKey = `locked-seats:${showId}`;
            const lockedSeats = await redis.smembers(lockedSeatsKey);

            const validSeats: string[] = [];

            for (const seatId of lockedSeats) {
              const seatLockKey = `seat-lock:${showId}:${seatId}`;
              const exists = await redis.get(seatLockKey);
              if (exists) {
                validSeats.push(seatId);
              } else {
                // remove stale member from the set
                await redis.srem(lockedSeatsKey, seatId);
              }
            }

            // Broadcast active locked seats to everyone in the room
            const payload = JSON.stringify({
              type: "locked-seats-initials",
              seatIds: validSeats,
            });

            room.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });

            break;
          }

          /**
           * LOCK SEATS
           * ----------
           * User clicks "Proceed"
           * We lock seats for 5 minutes
           */
          case "lock-seats": {
            const { showId, seatIds, userId } = msg;

            if (!showId || !userId || seatIds.length <= 0) {
              return;
            }

            console.log("showId", showId);
            console.log("userid", userId);
            console.log("seatIds", seatIds);

            const lockedSeatsKeys = `locked-seats:${showId}`;
            const unavailableSeats: string[] = [];

            // Check if seat is already locked
            for (const seatId of seatIds) {
              const seatLockKey = `seat-lock:${showId}:${seatId}`;
              const exisitingLock = await redis.get(seatLockKey);

              if (exisitingLock) {
                unavailableSeats.push(seatId);
              }
            }

            /**
             * If any seat already locked → reject request
             */
            if (unavailableSeats.length > 0) {
              // Send rejection only to this user
              socket.send(
                JSON.stringify({
                  type: "seat-locked-failed",
                  showId,
                  requested: seatIds,
                  alreadyLocked: unavailableSeats,
                }),
              );
              return; // stop further processing
            }

            // Lock all the seats
            for (const seatId of seatIds) {
              const seatLockKey = `seat-lock:${showId}:${seatId}`;

              // store seat lock with userId for 5 minute
              await redis.set(seatLockKey, userId, "EX", 300);

              // add this seat to locked seat set
              await redis.sadd(lockedSeatsKeys, seatId);
            }

            // broadcast to the user in the same room/show
            let room = rooms.get(showId);

            if (!room) {
              room = new Set();
              rooms.set(showId, room);
            }

            const payload = JSON.stringify({
              type: "seat-locked",
              showId,
              userId,
              seatIds,
            });

            room.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });

            break;
          }

          /* UNLOCK SEATS
           * Triggered when:
           * - User leaves checkout or Checkout time expired
           * - User cancels booking
           */

          case "unlock-seats": {
            const { showId, seatIds, userId } = msg;

            if (!showId || !userId || seatIds.length <= 0) {
              return;
            }

            const lockedSeatsKeys = `locked-seats:${showId}`;

            for (const seatId of seatIds) {
              const seatLockKey = `seat-lock:${showId}:${seatId}`;

              // remove indivisual seat lock
              await redis.del(seatLockKey);

              /**
               * Remove seat from locked SET
               */

              await redis.srem(lockedSeatsKeys, seatId);
            }

            // broadcast to the user in the same room/show
            let room = rooms.get(showId);

            if (!room) {
              room = new Set();
              rooms.set(showId, room);
            }

            const payload = JSON.stringify({
              type: "seat-unlocked",
              showId,
              userId,
              seatIds,
            });

            room.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });

            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error("Failed to handle message", err);
      }
    })();
  });

  socket.on("close", () => {
    const showId = (socket as SocketWithShowId).showId;
    if (showId) {
      const room = rooms.get(showId);
      if (room) {
        room.delete(socket);
      }
    }
  });
};
