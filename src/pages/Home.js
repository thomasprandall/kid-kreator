const Home = () => {
    return (
        <div className="w-full h-screen bg-orange">
            <main className="mt-10 mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
                <div className="sm:text-center lg:text-left">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Keep track of your kids</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        Please enjoy this simple Kid creator and manager for the astounding Tales from the Loop game by Free League Publishing.
                    </p>
                    <p className="text-sm md:text-base">
                        Special thanks to the amazing people behing this game including: Simon Stålenhag, Nils Hintze, Tomas Härenstam, Matt Forbeck, Nils Karlén, Björn Hellqvist, and Christian Granath.
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <a href="/app" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow hover:bg-orange-light md:py-4 md:text-lg md:px-10"> 
                                Open App
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
};

export default Home;
