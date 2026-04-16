import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <span className="text-xl font-bold text-blue-600">
                            NiveshAI
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-gray-600 text-sm">
                            👤 {user?.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {user?.email}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="md:hidden text-gray-600 text-2xl"
                    >
                        {showMenu ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMenu && (
                    <div className="md:hidden mt-3 pb-3 border-t pt-3">
                        <p className="text-gray-600 text-sm mb-2">
                            👤 {user?.name}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                            {user?.email}
                        </p>
                        <button
                            onClick={logout}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
