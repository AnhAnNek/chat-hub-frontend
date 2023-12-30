import { useState } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

const Header = () => {
    const navigate = useNavigate();

    const Auth = useAuth();
    const isAuthenticated = Auth.userIsAuthenticated();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const onLogout = () => {
        Auth.userLogout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <h1 className="text-2xl font-bold">
                        <a href="/chat-page" className="-m-1.5 p-1.5">
                            <span className="sr-only">Chat hub</span>
                            Chat Hub
                        </a>
                    </h1>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        New feed
                    </a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        Notifications
                    </a>
                </Popover.Group>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {isAuthenticated ? (
                        <a href="#" className="text-sm font-semibold leading-6 text-gray-900" onClick={onLogout}>
                            Log out <span aria-hidden="true">&larr;</span>
                        </a>
                    ) : (
                        <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </a>
                    )}
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            <a href="/chat-page" className="-m-1.5 p-1.5">
                                <span className="sr-only">Chat hub</span>
                                Chat Hub
                            </a>
                        </h1>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <FontAwesomeIcon icon={faXmark} className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    New feed
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Notifications
                                </a>
                            </div>
                            <div className="py-6">
                                {isAuthenticated ? (
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        onClick={onLogout}
                                    >
                                        Log out
                                    </a>
                                ): (
                                    <a
                                        href="/login"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}

export default Header;