interface AuthFormWrapperProps {
    children: React.ReactNode
    title: string
    subtitle?: string
}

export function AuthFormWrapper({ children, title, subtitle }: AuthFormWrapperProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900">{title}</h2>
                    {subtitle && (
                        <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    )
}

