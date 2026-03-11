import { useForm } from "react-hook-form";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContextObj } from "../contexts/AuthorContext";

function RoleSelection() {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(userContextObj);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "",
    },
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (formData) => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:4000/user-api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: formData.role }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Profile creation failed");
      }

      const resBody = await res.json();

      const role = resBody.payload.role;

      setCurrentUser(resBody.payload);

      if (role === "USER") {
        navigate("/user-dashboard");
      } else {
        navigate("/author-dashboard");
      }
    } catch (err) {
      console.error("Role selection error:", err);
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Select your role</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* USER */}
        <label style={{ display: "block", marginBottom: 10 }}>
          <input
            type="radio"
            value="USER"
            {...register("role", { required: "Please select a role" })}
          />
          User
        </label>

        {/* AUTHOR */}
        <label style={{ display: "block", marginBottom: 10 }}>
          <input
            type="radio"
            value="AUTHOR"
            {...register("role", { required: "Please select a role" })}
          />
          Author
        </label>

        {errors.role && (
          <p style={{ color: "red" }}>{errors.role.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default RoleSelection;