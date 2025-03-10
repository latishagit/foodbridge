import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ADashboard = () => {
    const [username, setUsername] = useState('');
    const [tables, setTables] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [primaryKey, setPrimaryKey] = useState('id'); // default fallback
    const [editingId, setEditingId] = useState(null); // To track if we're editing a record

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            const user = getUserFromLocalStorage();
            setUsername(user?.name || '');

            if (user && user.id) {
                try {
                    const response = await api.post('/tables.php');
                    setTables(response.data.tables || []);
                } catch (error) {
                    console.error("Error fetching tables:", error);
                }
                setIsLoading(false);
            } else {
                navigate('/login');
            }
        };

        fetchTables();
    }, [navigate]);

    const displayTable = async (table) => {
        setSelectedTable(table);
        try {
            const response = await api.post('/fetchTable.php', { table_name: table });
            if (response.data.success) {
                setTableData(response.data.tabledata);
                if (response.data.tabledata.length > 0) {
                    const keys = Object.keys(response.data.tabledata[0]);
                    const pk = keys.find(key => key.endsWith('_id'));
                    setPrimaryKey(pk);

                    const initialFormData = {};
                    keys.forEach(col => {
                        initialFormData[col] = '';
                    });
                    setFormData(initialFormData);
                }
            }
        } catch (error) {
            console.error("Error fetching table data:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInsert = async () => {
        try {
            const response = await api.post('/insert.php', { table_name: selectedTable, data: formData });
            if (response.data.success) {
                alert("Record inserted successfully!");
                displayTable(selectedTable);
            }
        } catch (error) {
            console.error("Error inserting record:", error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const response = await api.post('/update.php', { table_name: selectedTable, data: formData, id });
            if (response.data.success) {
                alert("Record updated successfully!");
                displayTable(selectedTable);
                setEditingId(null); // Clear edit mode after update
                setFormData({});
            }
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    const handleEdit = (record) => {
        setEditingId(record[primaryKey]);  // Set the record ID being edited
        setFormData(record);               // Populate the form with the record's data
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete('/delete.php', {
                data: { table_name: selectedTable, id }
            });
            if (response.data.success) {
                alert("Record deleted successfully!");
                displayTable(selectedTable); // Refresh table data
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex">
                <div className="w-25 border p-3">
                    <h3>All Tables</h3>
                    <ul style={{ listStyleType: 'none' }}>
                        {tables.map((table, index) => (
                            <li key={index} onClick={() => displayTable(table)}>{table}</li>
                        ))}
                    </ul>
                </div>
                <div className="w-75 border p-3">
                    <h5>Table Data: {selectedTable || "Select a Table"}</h5>
                    {tableData.length > 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {Object.keys(tableData[0]).map((column, index) => (
                                        <th key={index}>{column}</th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((value, colIndex) => (
                                            <td key={colIndex}>{value}</td>
                                        ))}
                                        <td>
                                            <button onClick={() => handleEdit(row)}>Edit</button>
                                            <button onClick={() => handleDelete(row[primaryKey])}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available for this table.</p>
                    )}
                    {selectedTable && (
                        <div>
                            <h5>{editingId ? "Update Record" : "Insert New Record"}</h5>
                            {Object.keys(formData).map((key, index) => (
                                <input
                                    key={index}
                                    name={key}
                                    placeholder={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                />
                            ))}
                            {editingId ? (
                                <div>
                                    <button onClick={() => handleUpdate(editingId)}>Update</button>
                                    <button onClick={() => { setEditingId(null); setFormData({}); }}>Cancel</button>
                                </div>
                            ) : (
                                <button onClick={handleInsert}>Insert</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ADashboard;

