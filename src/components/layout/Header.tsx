import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModalLogout from "../modals/ConfirmModalLogout";
import { logout } from "../../api/auth";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="h-14 bg-white border-b flex items-center justify-end px-6">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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