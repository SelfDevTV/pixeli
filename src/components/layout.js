import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      <div className="bottom-16 fixed flex w-full items-center justify-center">
        <Link href="/">
          <a className="px-4 py-1 bg-yellow-700 rounded-lg text-white">
            Go to Home
          </a>
        </Link>
        <p className="ml-12 text-xs"> - Copyright @SelfDevTV 2021</p>
      </div>
    </div>
  );
};

export default Layout;
