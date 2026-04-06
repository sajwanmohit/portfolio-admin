import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../../api/profile";
import { apiToast } from "../../utils/apiToast";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    about: "",
    ownerGithubProfileURL: "",
    ownerLinkedinProfileURL: "",
    ownerEmailAddress: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res) setForm(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await apiToast(saveProfile(form), {
      loading: "Saving profile...",
      success: "Profile saved",
      error: "Failed",
    });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
      <textarea name="about" value={form.about} onChange={handleChange} placeholder="About" />

      <input name="ownerGithubProfileURL" value={form.ownerGithubProfileURL} onChange={handleChange} placeholder="GitHub URL" />
      <input name="ownerLinkedinProfileURL" value={form.ownerLinkedinProfileURL} onChange={handleChange} placeholder="LinkedIn URL" />
      <input name="ownerEmailAddress" value={form.ownerEmailAddress} onChange={handleChange} placeholder="Email" />

      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}