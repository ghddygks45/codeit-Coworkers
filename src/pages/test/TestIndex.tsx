import { Link } from "react-router-dom";

export default function TestIndex() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Test Pages</h1>

        <ul className="space-y-3">
          <li>
            <Link
              to="/test/gnb"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              GNB
            </Link>
          </li>

          <li>
            <Link
              to="/test/button"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Button
            </Link>
          </li>

          <li>
            <Link
              to="/test/badge"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Badge
            </Link>
          </li>

          <li>
            <Link
              to="/test/todo"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              todo
            </Link>
          </li>
          <li>
            <Link
              to="/test/calendar"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              📅 Calendar & TimePicker
            </Link>
          </li>

          <li>
            <Link
              to="/test/input"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Input
            </Link>
          </li>

          <li>
            <Link
              to="/test/toast"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Toast
            </Link>
          </li>

          <li>
            <Link
              to="/test/dropdown"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Dropdown
            </Link>
          </li>

          <li>
            <Link
              to="/test/list-page"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              List Page
            </Link>
          </li>

          <li>
            <Link
              to="/test/modal"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              Modal
            </Link>
          </li>

          <li>
            <Link
              to="/test/error-boundary"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:border-gray-300 hover:bg-gray-100"
            >
              ErrorBoundary
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
