import heroImg from "../../assets/hero.webp";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

  const naviToAllCollection = ()=>{
    navigate('/collections/all');
  }

  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="SoftWear"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Vacation <br />
            Ready
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our vacation ready outfits with fast worldwide shipping.
          </p>
          <button
            onClick={naviToAllCollection}
            className="bg-white hover:bg-gray-200 transition-colors text-zinc-800 px-6 py-2 rounded-4xl text-lg font-semibold"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
