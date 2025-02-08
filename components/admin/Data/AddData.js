"use client";
import { Layout, Input, Select, Button, Form, Modal, message, Upload } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Sidebar from "../../AdminSidebar";
import HeaderComponent from "../../Header";
import '@ant-design/v5-patch-for-react-19';
import React, { useState } from "react";

const { Option } = Select;
const { Content } = Layout;

const AddData = () => {
  const [formFields, setFormFields] = useState([]);
  const [fieldType, setFieldType] = useState("text");
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add a new field
  const addField = () => {
    if (!label.trim()) {
      message.error("Label cannot be empty!");
      return;
    }

    const newField = {
      label,
      type: fieldType,
      options: ["radio", "checkbox", "select"].includes(fieldType) ? options : [],
    };

    if (editIndex !== null) {
      const updatedFields = [...formFields];
      updatedFields[editIndex] = newField;
      setFormFields(updatedFields);
      setEditIndex(null);
      message.success("Field updated successfully!");
    } else {
      setFormFields([...formFields, newField]);
      message.success("Field added successfully!");
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setLabel("");
    setFieldType("text");
    setOptions([]);
    setEditIndex(null);
  };

  // Edit a field
  const editField = (index) => {
    const field = formFields[index];
    setLabel(field.label);
    setFieldType(field.type);
    setOptions(field.options);
    setEditIndex(index);
  };

  // Delete a field
  const deleteField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    message.success("Field deleted successfully!");
  };

  // Add option to select/radio/checkbox fields
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Update option value
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Delete an option
  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  // Show Modal for confirmation
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle Modal OK
  const handleOk = () => {
    message.success("Form saved successfully!");
    setIsModalOpen(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderComponent />
        <Content className="p-6 bg-gray-100">
          <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
            <h2 className="text-xl font-semibold mb-4">Add Data</h2>

            {/* Form to Add Fields */}
            <div className="mb-4">
              <label className="block text-gray-700">Field Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Enter field label" className="mt-2" />

              <label className="block text-gray-700 mt-3">Field Type</label>
              <Select value={fieldType} onChange={setFieldType} className="w-full mt-2">
                <Option value="text">Text</Option>
                <Option value="number">Number</Option>
                <Option value="radio">Radio</Option>
                <Option value="checkbox">Checkbox</Option>
                <Option value="select">Dropdown</Option>
                <Option value="file">File Upload</Option>
              </Select>

              {/* Options for Select, Radio, Checkbox */}
              {["radio", "checkbox", "select"].includes(fieldType) && (
                <div className="mt-3">
                  <label className="block text-gray-700">Options</label>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <Input value={option} onChange={(e) => updateOption(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                      <Button type="danger" icon={<DeleteOutlined />} onClick={() => deleteOption(index)} />
                    </div>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={addOption} className="mt-2">Add Option</Button>
                </div>
              )}

              <Button type="primary" className="mt-4 w-full" onClick={addField}>{editIndex !== null ? "Update Field" : "Add Field"}</Button>
            </div>

            <hr className="my-5" />

            {/* Form Preview */}
            <h3 className="text-lg font-semibold mb-3">Form Preview</h3>
            <Form layout="vertical">
              {formFields.map((field, index) => (
                <div key={index} className="mb-4 p-3 border rounded">
                  <label className="block font-semibold">{field.label}</label>
                  {field.type === "text" && <Input placeholder="Enter text" />}
                  {field.type === "number" && <Input type="number" placeholder="Enter number" />}
                  {field.type === "file" && <Upload><Button icon={<UploadOutlined />}>Upload</Button></Upload>}
                  {["radio", "checkbox"].includes(field.type) &&
                    field.options.map((option, i) => <label key={i} className="block"><input type={field.type} /> {option}</label>)}
                  {field.type === "select" && <Select className="w-full">{field.options.map((option, i) => <Option key={i} value={option}>{option}</Option>)}</Select>}
                  <div className="flex justify-between mt-2">
                    <Button icon={<EditOutlined />} onClick={() => editField(index)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} type="danger" onClick={() => deleteField(index)}>Delete</Button>
                  </div>
                </div>
              ))}
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AddData;
