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
                    <meta name="description" content="Boost productivity with our ADHD-friendly app. Features tools for work and study, including journal, todo lists, and time management. AI powered organization coming soon to iPhone, iPad, and Android."></meta>
                </Head>
                <body>
                    <Main />
                    <NextScript/>
                </body>
            </Html>
        )
    }

}