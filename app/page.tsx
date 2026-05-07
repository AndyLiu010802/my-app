import dynamic from "next/dynamic";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import { getAllProperties, getHeroVideoUrl, getLocationImages } from "../lib/datocms";

const About = dynamic(() => import("./components/About"));
const Properties = dynamic(() => import("./components/Properties"));
const Amenities = dynamic(() => import("./components/Amenities"));
const Location = dynamic(() => import("./components/Picture"));
const Enquiry = dynamic(() => import("./components/Enquiry"));
const Footer = dynamic(() => import("./components/Footer"));

export default async function Home() {
  const [properties, heroVideoUrl, locationImages] = await Promise.all([
    getAllProperties(),
    getHeroVideoUrl(),
    getLocationImages(),
  ]);

  return (
    <>
      <Navigation />
      <main>
        <Hero videoUrl={heroVideoUrl} />
        <About />
        <Properties properties={properties} />
        <Amenities />
        <Location images={locationImages} />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
