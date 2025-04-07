import React from "react";

export function Hero() {
  const title = "Welcome to Our Site";
  const subtitle = "We create awesome experiences";
  const backgroundImage = "https://example.com/default-hero.jpg";

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg md:text-2xl drop-shadow">{subtitle}</p>
      </div>
    </div>
  );
}
