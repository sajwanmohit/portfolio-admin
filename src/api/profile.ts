import api from "./axios";

export type ProfileDetails = {
  name: string;
  designation: string;
  about: string;
  ownerGithubProfileURL: string;
  ownerLinkedinProfileURL: string;
  ownerEmailAddress: string;
};

export const getProfile = async () => {
  const res = await api.get<unknown>("/admin/profile", { timeout: 15000 });
  return res.data;
};

export const saveProfile = async (data: ProfileDetails) => {
  const res = await api.post<ProfileDetails>("/admin/profile", data);
  return res.data;
};
