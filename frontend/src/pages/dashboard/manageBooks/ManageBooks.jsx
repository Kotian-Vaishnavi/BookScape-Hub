import React from "react";
import {
  useFetchAdminBooksQuery,
  useDeleteBookMutation,
} from "../../../redux/features/books/booksApi";
import { Link, useNavigate } from "react-router-dom";

const ManageBooks = () => {
  const navigate = useNavigate();
  const {
    data: books = [],
    refetch,
    isLoading,
    isError,
  } = useFetchAdminBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id).unwrap();
      alert("Book deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading books.</div>;

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
            <h3 className="font-semibold text-base text-blueGray-700">
              My Books
            </h3>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs uppercase text-left">#</th>
                  <th className="px-6 py-3 text-xs uppercase text-left">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs uppercase text-left">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs uppercase text-left">
                    Price
                  </th>
                  <th className="px-6 py-3 text-xs uppercase text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No books uploaded yet.
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{book.title}</td>
                      <td className="px-6 py-4">
                        {book.category
                          ? book.category
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join("-")
                          : ""}
                      </td>

                      <td className="px-6 py-4">₹{book.newPrice}</td>
                      <td className="px-6 py-4 space-x-2">
                        <Link
                          to={`/dashboard/edit-book/${book._id}`}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
