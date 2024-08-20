const Navbar: React.FC = () => {
    return (
        <nav className="border-gray-200 bg-[#49AA4D]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="text-white dark:text-white self-center text-3xl font-semibold whitespace-nowrap">Keyword Parser</span>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;