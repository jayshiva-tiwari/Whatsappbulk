import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

export const fetchConfig = async () => {
  const { data } = await api.get("/config");
  return data;
};

export const processSpreadsheet = async (payload, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("countryCode", payload.countryCode);
  formData.append("contactPrefix", payload.contactPrefix);
  formData.append("batchSize", String(payload.batchSize));
  formData.append("groupPrefix", payload.groupPrefix);

  const { data } = await api.post("/process", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return data;
};

export const downloadVcf = async ({ contacts, contactPrefix }) => {
  const response = await api.post(
    "/export/vcf",
    { contacts, contactPrefix },
    {
      responseType: "blob"
    }
  );

  return response;
};

