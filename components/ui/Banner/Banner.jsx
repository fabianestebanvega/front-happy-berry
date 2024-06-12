import { useEffect, useState } from "react";
import TimerIcon from '@mui/icons-material/Timer';
import NavLink from "../NavLink";
import Image from "next/image";

const Banner = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    countdown();
  }, []);

  const countdown = () => {
    var now = new Date();
    var endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    var timeLeft = endOfDay - now;

    var hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    var seconds = Math.floor((timeLeft / 1000) % 60);
    setTime(hours + "h : " + minutes + "m : " + seconds + "s");

    setTimeout(countdown, 1000);
  };

  return (
    <div className="bg-green-700">
      <div className="max-w-screen-xl mx-auto flex items-start justify-between text-white sm:items-center md:px-8">
        <div className="flex-1 justify-center flex items-start gap-x-4 sm:items-center">
          <NavLink
            title="Happy Berry"
            href="/"
            className="flex items-center justify-center gap-x-1 text-sm text-white font-medium hover:scale-110 active:bg-gray-900 md:inline-flex"
          >
           
          
          </NavLink>
          <p className="font-medium p-2">
          Happy Berry 🍓 ¡Promociones diariamente! <TimerIcon/>{" "}
            <a
              href="javascript:(0)"
              className="font-semibold underline duration-150 hover:text-indigo-100 inline-flex items-center gap-x-1"
            >
              {time}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
