// pages/404.js
import Link from 'next/link';

export default function Custom404 (){
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">
        HOME
      </Link>
    </div>
  );
};