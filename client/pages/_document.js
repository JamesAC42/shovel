import Document, {Html, Head, Main, NextScript} from 'next/document';

export default class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head>
                    <script 
                        async 
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1717794133911955"
                        crossOrigin="anonymous"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript/>
                </body>
            </Html>
        )
    }

}