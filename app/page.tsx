import Starfield from 'react-starfield';
import Planner from "../components/Planner"
export default function Example() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        <Starfield
          starCount={1300}
          starColor={[255, 255, 255]}
          speedFactor={0.06}
          backgroundColor="black"
        />
      </div>

      {/* Foreground Content */}
      <div className="min-h-screen flex items-center justify-center bg-black"> 
        <div className="relative z-10 px-4 mx-auto max-w-screen-xl text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            ODESSEY
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Let us plan your next move—effortlessly.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">

          <input type="text" id="helper-text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-md p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Where do you want to go?"/>
          <Planner/>
          </div>
        </div>
      </div>
    </section>
  );
}

