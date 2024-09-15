"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  Interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterpretations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/interpretations");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretations(data);
      } catch (error) {
        console.log("Error", error);
        setError("Failed to load Interpretations , please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/interpretations/${id}`, { method: "DELETE" });
      setInterpretations((prevInterpretations) =>
        prevInterpretations?.filter((it) => it.$id != id)
      );
    } catch (error) {
      setError("Failed to delete Interpretations , please try again later");
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {loading ? (
        <p>loading Interpretations....</p>
      ) : interpretations?.length > 0 ? (
        <div className="p-4 my-2 rounded-md border-b leading-8">
          {interpretations?.map((ip) => (
            <div
              key={ip.$id}
              className="p-4 my-2 rounded-md border-b leading-8"
            >
              <div className="font-bold">{ip.term}</div>
              <div>{ip.Interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/edit/${ip.$id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(ip.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No interpretations Found.</div>
      )}
    </div>
  );
}
