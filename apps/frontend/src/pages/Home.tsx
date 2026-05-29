import LiveEvents from "../components/LiveEvents";
import Recommended from "../components/Recommended";
import BannerSlider from "../components/shared/BannerSlider";

function Home() {
  return (
    <>
      <BannerSlider />
      <Recommended />
      <LiveEvents />
    </>
  );
}

export default Home;
