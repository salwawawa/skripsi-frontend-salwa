import React from 'react';

const menuItems = [
  {
    name: 'Ayam Geprek',
    price: 'Rp 15.000',
    image: '/api/placeholder/300/200',
    category: 'Rasa Pedas'
  },
  {
    name: 'Spaghetti Bolognese',
    price: 'Rp 20.000',
    image: '/api/placeholder/300/200',
    category: 'Pasta'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-green-600 mb-3">Kuliner Tamansari</h1>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-700">Home</a>
            <a href="#" className="text-gray-700">Menu</a>
            <a href="#" className="text-gray-700">About</a>
            <a href="#" className="text-gray-700">Events</a>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="h-64 overflow-hidden">
        <img 
          src="/api/placeholder/1200/300" 
          alt="Kuliner Tamansari Spread" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Recommended Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Menu Rekomendasi Hari Ini</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-green-600">{item.price}</span>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;