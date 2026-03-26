import React, { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../../api/studentApi";
import API from "../../api/authApi";
import StudentDetailsModal from "./StudentDetailsModal";
import AddStudentModal from "./AddStudentModal";
import Sidebar from "../../components/Sidebar";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const role = localStorage.getItem("role");
  const user = { role }; // Create a user object to match usage in JSX

  const fetchStudents = async () => {
    const res = await getStudents({
      name: search || undefined,
      categoryId: category || undefined,
    });
    setStudents(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/api/admin/getCategories");
    setCategories(res.data);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingStudent(null);
    setIsEditModalOpen(false);
    fetchStudents(); // Refresh list after edit
  };

  useEffect(() => {
    fetchCategories();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, category]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeNav="Students" />

      {/* Page Content */}
      <div className="flex-1 p-4 pt-16 md:p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Students</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-64"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.categoryId?.name}</td>
                  <td className="p-3">{s.classId?.name}</td>
                  <td className="p-3">{s.academicYearId?.year}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleView(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                    {user.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            role={user?.role}
          />
        )}

        {/* Edit Modal */}
        <AddStudentModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={editingStudent}
          onSuccess={handleCloseEdit}
        />      </div>
    </div>
  );
};

export default StudentsPage;
