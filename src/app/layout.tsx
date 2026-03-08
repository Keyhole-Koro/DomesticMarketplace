import "./globals.css";

export const metadata = {
    title: "c0mpile Marketplace",
    description: "Internal Tools & Business Apps Store",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
