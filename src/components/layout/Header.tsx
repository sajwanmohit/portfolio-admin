import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModalLogout from "../modals/ConfirmModalLogout";
import { logout } from "../../api/auth";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-end border-b bg-white px-3 sm:px-6">
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <ConfirmModalLogout
        isOpen={open}
        title="Logout"
        message="Do you really want to logout?"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          logout(navigate);
        }}
      />
    </>
  );
}

export default Header;