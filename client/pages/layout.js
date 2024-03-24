import '../styles/global.scss';

export default Layout = ({children}) => {
    return (
        <html>
            <Head>
                <title>Shovel</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>

                {children}
            </body>
        </html>
    )
}
