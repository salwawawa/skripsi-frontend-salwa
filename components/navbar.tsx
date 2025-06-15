'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { apiService } from '../lib/api-service';
import { Product, Shop, Activity } from '../lib/types';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: Product[]; shops: Shop[]; activities: Activity[] }>({ products: [], shops: [], activities: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], shops: [], activities: [] });
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError(null);

    const handler = setTimeout(async () => {
      try {
        const [products, shops, activities] = await Promise.all([
          apiService.searchProducts(searchQuery),
          apiService.searchShops(searchQuery),
          apiService.searchActivities(searchQuery),
        ]);
        setSearchResults({ products, shops, activities });
        setShowDropdown(true);
      } catch (err) {
        setError('Failed to fetch search results.');
        setShowDropdown(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowDropdown(false);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileSearchOpen) {
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  return (
    <nav className="bg-green-600 text-white shadow-md w-full sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Mobile Search Bar - Full Width */}
        {isMobileSearchOpen && (
          <div className="md:hidden bg-green-600 py-3 border-b border-green-500">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-md shadow-md relative">
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-black rounded-l-md px-4 py-3 focus:outline-none flex-1 text-base"
                onFocus={() => {
                  if (searchResults.products.length > 0 || searchResults.shops.length > 0 || searchResults.activities.length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />
              <button type="submit" className="text-green-600 hover:text-green-800 px-4 py-3 rounded-r-md">
                <FiSearch size={20} />
              </button>

              {/* Mobile Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white text-black rounded-md shadow-lg z-50 overflow-auto max-h-96">
                  {loading && <div className="p-4">Loading...</div>}
                  {error && <div className="p-4 text-red-600">{error}</div>}
                  {!loading && !error && (
                    <>
                      {searchResults.products.length === 0 && searchResults.shops.length === 0 && searchResults.activities.length === 0 && (
                        <div className="p-4">No results found.</div>
                      )}
                      {searchResults.products.length > 0 && (
                        <div className="p-4 border-b">
                          <h3 className="font-semibold text-black mb-2">Products</h3>
                          <ul>
                            {searchResults.products.map((product) => (
                              <li key={product.id} className="mb-2 text-black-600 hover:bg-gray-100 rounded p-2 cursor-pointer">
                                <Link href={`/products/${product.id}`} onClick={() => {
                                  setShowDropdown(false);
                                  setIsMobileSearchOpen(false);
                                }}>
                                  {product.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.shops.length > 0 && (
                        <div className="p-4 border-b">
                          <h3 className="font-semibold text-black-600 mb-2">Shops</h3>
                          <ul>
                            {searchResults.shops.map((shop) => (
                              <li key={shop.id} className="mb-2 text-black-600 hover:bg-gray-100 rounded p-2 cursor-pointer">
                                <Link href={`/stores/${shop.id}`} onClick={() => {
                                  setShowDropdown(false);
                                  setIsMobileSearchOpen(false);
                                }}>
                                  {shop.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.activities.length > 0 && (
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">Activities</h3>
                          <ul>
                            {searchResults.activities.map((activity) => (
                              <li key={activity.id} className="mb-2 hover:bg-gray-100 rounded p-2 cursor-pointer">
                                <Link href={`/activities/${activity.id}`} onClick={() => {
                                  setShowDropdown(false);
                                  setIsMobileSearchOpen(false);
                                }}>
                                  {activity.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        )}

        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold hover:text-green-200">
            Sentra Tamansari
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center relative">
            <Link href="/" className="hover:text-green-200 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-green-200 transition-colors">About</Link>
            <Link href="/menu" className="hover:text-green-200 transition-colors">Products</Link>
            <Link href="/events" className="hover:text-green-200 transition-colors">Events</Link>

            {/* Desktop Search Form */}
            <form onSubmit={handleSearchSubmit} className="ml-4 flex items-center bg-yellow-400 rounded-full px-3 py-1 shadow-md relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-black rounded-l-full px-3 py-1 focus:outline-none w-48 md:w-64"
                onFocus={() => {
                  if (searchResults.products.length > 0 || searchResults.shops.length > 0 || searchResults.activities.length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />
              <button type="submit" className="text-green-600 hover:text-green-800 p-1 rounded-r-full">
                <FiSearch size={20} />
              </button>

              {/* Desktop Dropdown */}
              {showDropdown && (
                <div ref={dropdownRef} className="absolute top-full left-0 mt-1 w-full max-w-md bg-white text-black rounded-md shadow-lg z-50 overflow-auto max-h-96">
                  {loading && <div className="p-4">Loading...</div>}
                  {error && <div className="p-4 text-red-600">{error}</div>}
                  {!loading && !error && (
                    <>
                      {searchResults.products.length === 0 && searchResults.shops.length === 0 && searchResults.activities.length === 0 && (
                        <div className="p-4">No results found.</div>
                      )}
                      {searchResults.products.length > 0 && (
                        <div className="p-4 border-b">
                          <h3 className="font-semibold text-black mb-2">Products</h3>
                          <ul>
                            {searchResults.products.map((product) => (
                              <li key={product.id} className="mb-2 hover:bg-gray-100 rounded p-1 cursor-pointer">
                                <Link href={`/products/${product.id}`} onClick={() => setShowDropdown(false)}>
                                  {product.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.shops.length > 0 && (
                        <div className="p-4 border-b">
                          <h3 className="font-semibold mb-2">Shops</h3>
                          <ul>
                            {searchResults.shops.map((shop) => (
                              <li key={shop.id} className="mb-2 hover:bg-gray-100 rounded p-1 cursor-pointer">
                                <Link href={`/stores/${shop.id}`} onClick={() => setShowDropdown(false)}>
                                  {shop.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.activities.length > 0 && (
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">Activities</h3>
                          <ul>
                            {searchResults.activities.map((activity) => (
                              <li key={activity.id} className="mb-2 hover:bg-gray-100 rounded p-1 cursor-pointer">
                                <Link href={`/activities/${activity.id}`} onClick={() => setShowDropdown(false)}>
                                  {activity.nama}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Search Icon Button */}
            <button 
              onClick={toggleMobileSearch}
              className={`p-2 rounded-full transition-colors ${isMobileSearchOpen ? 'bg-green-700' : 'hover:bg-green-700'}`}
              aria-label="Toggle search"
            >
              <FiSearch size={20} />
            </button>

            {/* Close button when search is open */}
            {isMobileSearchOpen && (
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Hamburger menu button */}
            {!isMobileSearchOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && !isMobileSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/menu" 
                className="block px-3 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/events" 
                className="block px-3 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}