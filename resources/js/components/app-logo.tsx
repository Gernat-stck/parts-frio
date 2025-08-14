import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md">
                <AppLogoIcon className="h-full w-full fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="mb-0.5 truncate leading-tight font-semibold text-xl">
                    <span className="animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                        Nexus
                    </span>
                    <span className="ml-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">BitGen</span>
                </span>
            </div>
        </>
    );
}
