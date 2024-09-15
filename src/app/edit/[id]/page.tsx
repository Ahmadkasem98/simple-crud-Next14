"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

type Props = {
  params: {
    id: String;
  };
};

const EditPage = ({ params }: Props) => {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();

        setFormData({
          term: data.interpretation.term,
          Interpretation: data.interpretation.Interpretation,
        });
      } catch (error) {}
    };
    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.Interpretation) {
      setError("Please Fill all Form Data");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/interpretations/${params.id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to Update interpretations");
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
      <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          placeholder="Term"
          value={formData.term}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
          rows={4}
          placeholder="Interpretation"
          value={formData.Interpretation}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white mt-5 px-4 py-2 rounded-md cursor-pointer"
        >
          {loading ? "...Updating" : "Update Interpretation"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EditPage;
