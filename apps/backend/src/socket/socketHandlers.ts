import WebSocket from "ws";
import type { RawData, WebSocketServer } from "ws";
import { MessageSchema } from "../types/socket.types.js";
import redis from "../config/redis.js";

/* eslint-disable no-console */

const rooms = new Map<string, Set<WebSocket>>();

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
             * Fetch all locked seats from Redis SET
             * Example key:
             * locked-seats:show123 -> ["A1","A2","B5"]
             */
            const lockedSeats = await redis.smembers(`locked-seats:${showId}`);

            // Broadcast active locked seats to everyone in the room
            const payload = JSON.stringify({
              type: "locked-seats-initials",
              seatIds: lockedSeats,
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
