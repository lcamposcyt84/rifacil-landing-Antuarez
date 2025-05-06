const Features = () => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h3 className="text-blue-700 font-semibold mb-4 text-lg">Bienvenido</h3>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 leading-tight text-gray-900">
              Alcanza en el mundo<br />de las rifas
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptates, quod, voluptatum, voluptas quae quidem.
            </p>
          </div>
          <div className="lg:w-1/2 relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {Array(4).fill(null).map((_, index) => (
              <div
                key={index}
                className={`p-6 sm:p-8 rounded-[5px] shadow-[12px_12px_15px_rgba(25,25,112,0.2)] hover:shadow-lg transition-shadow transform perspective-[800px] rotate-y-3 hover:rotate-y-0 ${
                  index === 0 ? 'bg-blue-800' : 'bg-white'
                }`}
                style={{
                  transform: 'skew(0deg, -4deg)',
                  transformOrigin: 'center',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ transform: 'skew(0deg, 4deg)' }}
                  className={`w-14 h-14 rounded-full mb-4 sm:mb-6 flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                >
                  {/* Círculo amarillo o azul */}
                </div>
                <div style={{ transform: 'skew(0deg, 4deg)' }}>
                  <h3 className={`font-bold text-lg mb-2 sm:mb-3 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>
                    Feature {index + 1}
                  </h3>
                  <p className={`leading-relaxed text-sm sm:text-base ${index === 0 ? 'text-white' : 'text-gray-600'}`}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit,Lorem ipsum dolor sit.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;