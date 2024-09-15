"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

type Props = {};

const CreatePage = (props: Props) => {
  const [formData, setFormData] = useState({ term: "", Interpretation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const router = useRouter();

  const handleInputChange = (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [value.target.name]: value.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.Interpretation) {
      setError("Please Fill all Form Data");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/interpretations", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interpretations");
      }
      router.push("/");
    } catch (error) {
      console.log("Error", error);
      setError("Failed to load Interpretations , please try again later");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          placeholder="Term"
          onChange={(e) => handleInputChange(e)}
          value={formData.term}
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="Interpretation"
          rows={4}
          placeholder="Interpretation"
          onChange={(e) => handleInputChange(e)}
          value={formData.Interpretation}
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          onClick={handleSubmit}
          className="bg-black text-white mt-5 px-4 py-2 rounded-md cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "...Adding" : "Add Interpretation"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreatePage;
