import { useEffect, useState } from "react";
import type { Contact } from "../../types/contact";
import { getContacts, deleteContact } from "../../api/contacts";
import toast from "react-hot-toast";
import ConfirmModalButton from "../modals/ConfirmModalButton";
import { apiToast } from "../../utils/apiToast";

export default function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const size = 5;

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  const fetchContacts = async () => {
    try {
      const res = await getContacts(page, size, search);
      setContacts(res.content);
      setTotal(res.totalElements);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await apiToast(deleteContact(id), {
      loading: "Deleting contact...",
      success: "Deleted successfully",
      error: "Delete failed",
    });

    if (res) fetchContacts();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Contacts</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name/email..."
        value={search}
        onChange={(e) => {
          setPage(0);
          setSearch(e.target.value);
        }}
        className="border px-3 py-2 rounded mb-4 w-full md:w-64"
      />

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.company || "-"}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedMessage(c.message)}
                    className="text-blue-500 underline"
                  >
                    View
                  </button>
                </td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 space-x-2">
                  <a
                    href={`mailto:${c.email}?subject=Regarding your inquiry&body=Hi ${c.name},`}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Email
                  </a>

                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {Math.ceil(total / size)}
        </span>

        <button
          disabled={(page + 1) * size >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModalButton
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await handleDelete(deleteId!);
          setDeleteId(null);
        }}
      />

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-2">Message</h2>
            <p className="text-sm whitespace-pre-wrap">{selectedMessage}</p>

            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
