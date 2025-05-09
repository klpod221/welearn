import Image from "next/image";

export default function Logo({ size = "default" }) {
  // Define size classes based on the size prop
  const sizeClasses = {
    small: {
      container: "gap-1",
      image: "w-[30px] h-[30px] md:w-[40px] md:h-[40px]",
      text: "flex gap-1 hidden md:flex",
      we: "text-2xl",
      learn: "text-2xl"
    },
    default: {
      container: "gap-2 md:gap-4",
      image: "w-[100px] h-[100px] lg:w-[150px] lg:h-[150px]",
      text: "",
      we: "text-5xl md:text-6xl lg:text-7xl",
      learn: "text-4xl md:text-5xl lg:text-6xl"
    },
  };

  const classes = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`flex items-center ${classes.container}`}>
      <Image
        src="/logo.png"
        alt="WeLearn Logo"
        width={150}
        height={150}
        className={classes.image}
      />
      <h1 className={`font-bold ${classes.text}`}>
        <p className={`text-[#1677FF] ${classes.we}`}>WE</p>
        <p className={`text-green-500 ${classes.learn}`}>LEARN</p>
      </h1>
    </div>
  );
}