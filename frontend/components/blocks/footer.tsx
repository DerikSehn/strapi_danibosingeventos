import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold">Company Name</h2>
                        <p className="mt-2">123 Main Street, City, Country</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end">
                        <a href="#" className="mr-4">About</a>
                        <a href="#" className="mr-4">Services</a>
                        <a href="#" className="mr-4">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;