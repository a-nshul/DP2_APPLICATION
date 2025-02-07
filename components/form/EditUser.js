"use client";
import React, { useState ,useEffect,Suspense} from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Card ,message} from "antd";
import { UploadOutlined ,ArrowLeftOutlined} from "@ant-design/icons";
import Sidebar from "../Sidebar"; 
import Axios from "axios";
import HeaderComponent from "../Header";
const { Option } = Select;
import { useRouter, useSearchParams } from "next/navigation";
const EditUser = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const handleUpload = ({ fileList }) => setFileList(fileList);
  const searchParams = useSearchParams();
  const userId = searchParams.get("id"); // Get user ID from URL
  const [loading, setLoading] = useState(true);
  const onFinish = (values) => {
    console.log("Form Submitted:", values);
  };
  useEffect(() => {
    if (!userId) {
      message.error("Invalid user ID.");
      router.push("/");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await Axios.get(
          `http://localhost:3001/api/user/getprofile?id=${userId}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );

        if (response.data.users.length > 0) {
          const userData = response.data.users[0];
          form.setFieldsValue({
            name: userData.personalDetails?.fullName || "",
            email: userData.contactInformation?.email || "",
            secondaryEmail:userData.contactInformation?.secondaryEmail || "",
            phone: userData.mobileno || "",
            currentAddress: userData.addressDetails?.currentAddress || "",
            permanentAddress: userData.addressDetails?.permanentAddress || "",
            // dateOfBirth:userData.personalDetails?.dateOfBirth || "",
            gender:userData.personalDetails?.gender || "",
            profilePhoto: userData.personalDetails?.profilePhoto || "",
            city: userData.addressDetails?.city || "",
            state: userData.addressDetails?.state || "",
            zipPostalCode: userData.addressDetails?.zipPostalCode || "",
            landmark: userData.addressDetails?.landmark || "",
            parentsOccupation:userData.matrimonyDetails?.familyDetails?.parentsOccupation ||"",
            siblings:userData.matrimonyDetails?.familyDetails?.siblings || "",
            employerName:userData.professionalDetails?.previousEmployers?.employerName ||"",
            // resume: userData.documentUploads?.resume || "",
            // idProof: userData.documentUploads?.idProof || "",
            // addressProof: userData.documentUploads?.addressProof || "",
            currentJobDetails: userData.professionalDetails?.currentJobDetails || "",
            employerCompanyName: userData.professionalDetails?.employerCompanyName || "",
            workExperience: userData.professionalDetails?.workExperience || "",
            skillsAndCertifications: userData.professionalDetails?.skillsAndCertifications || [],
            languagesKnown: userData.professionalDetails?.languagesKnown || [],
            roleAndResponsibilities:userData.professionalDetails?.roleAndResponsibilities || [],
            maritalStatus: userData.matrimonyDetails?.maritalStatus || [],
            religionCaste: userData.matrimonyDetails?.religionCaste || [],
            heightWeight: userData.matrimonyDetails?.heightWeight || [],
            dietaryPreferences: userData.matrimonyDetails?.dietaryPreferences || [],
            hobbiesAndInterests: userData.matrimonyDetails?.hobbiesAndInterests || [],
            ageRange: userData.matrimonyDetails?.preferredPartnerDetails?.ageRange || "",
            height : userData.matrimonyDetails?.preferredPartnerDetails?.height || "",
            location: userData.matrimonyDetails?.preferredPartnerDetails?.location || "",
            preferences:userData.matrimonyDetails?.preferredPartnerDetails?.preferences ||"",
          });
        } else {
          message.error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, form, router]);

  const handleUpdate = async (values) => {
    try {
      // const token = localStorage.getItem("token");
  
      // if (!token) {
      //   message.error("No token found, please log in again.");
      //   return;
      // }
  
      // Sending the request with the token in headers
      await Axios.put(
        `http://localhost:3001/api/user/updateprofile/${userId}`,
        values,
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
  
      message.success("User updated successfully!");
      router.push("/user");
    } catch (error) {
      console.error("Error updating user:", error);
  
      // Handle specific error from backend
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Failed to update user.");
      } else {
        message.error("Failed to update user.");
      }
    }
  };
  
  return (
    <Suspense>
    <div className="flex">
     <div className="fixed top-0 left-0 w-64 h-full bg-gray-800">
        <Sidebar />
      </div>
     <div className="flex-1 ml-64 min-h-screen flex flex-col overflow-y-auto">
     <HeaderComponent />
      <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-full ">
      <div className="flex justify-between items-center mb-6">
        {/* Back Icon */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/user")} // Go back to the previous page
          className="text-gray-800"
        >
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Edit User</h2>
        </div>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          {/* Personal Details */}
          <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Details:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your full name" }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true, message: "Please select your birth date" }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select your gender" }]}>
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Profile Photo" name="profilePhoto">
              <Upload listType="picture" beforeUpload={() => false} fileList={fileList} onChange={handleUpload}>
                <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
              </Upload>
            </Form.Item>
          </div>
          
          {/* Contact Information */}
          <h3 className="text-lg font-medium text-gray-700 mb-4">Contact Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="currentAddress" name="currentAddress" rules={[{ required: true, message: "Please enter your current address" }]}>
              <Input placeholder="Enter current address" />
            </Form.Item>
            <Form.Item label="Permanent Address" name="permanentAddress" rules={[{ required: true, message: "Please enter permanent address" }]}>
              <Input placeholder="Enter permanent address" />
            </Form.Item>
          </div>
          
          {/* Address Details */}
          <h3 className="text-lg font-medium text-gray-700 mb-4">Address Details:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Secondary Email" name="secondaryEmail" rules={[{ required: true, message: "Please enter secondary email" }]}>
              <Input placeholder="Enter secondary email" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter your city" }]}>
              <Input placeholder="Enter city" />
            </Form.Item>
            <Form.Item label="State" name="state" rules={[{ required: true, message: "Please enter state" }]}>
              <Input placeholder="Enter state" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Landmark" name="landmark" rules={[{ required: true, message: "Please enter landmark" }]}>
              <Input placeholder="Enter landmark" />
            </Form.Item>
            <Form.Item label="Zip/Postal Code" name="zipPostalCode" rules={[{ required: true, message: "Please enter zip/postal code" }]}>
              <Input placeholder="Enter zip/postal code" />
            </Form.Item>
          </div>
          {/* Professional Details */}
          <h3 className="text-lg font-medium text-gray-700 mb-4">Professional Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Current Job Details" name="currentJobDetails">
                <Input placeholder="Enter current job details" />
                </Form.Item>
                <Form.Item label="Employer Company Name" name="employerCompanyName">
                <Input placeholder="Enter employer company name" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Work Experience (Years)" name="workExperience" rules={[{ type: 'number', message: "Must be a number" }]}> 
                <Input type="number" placeholder="Enter years of experience" />
                </Form.Item>
                <Form.Item label="Skills & Certifications" name="skillsAndCertifications">
                <Input placeholder="Enter skills and certifications (comma separated)" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Languages Known" name="languagesKnown">
                <Input placeholder="Enter languages known (comma separated)" />
                </Form.Item>
                <Form.Item label="Role & Responsibilities" name="roleAndResponsibilities">
                <Input placeholder="Enter role and responsibilities" />
                </Form.Item>
            </div>
            
            <h4 className="text-md font-medium text-gray-700 mt-6 mb-4">Education History:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="Degree Earned" name="degreeEarned">
                <Input placeholder="Enter degree" />
                </Form.Item>
                <Form.Item label="Institution Attended" name={["educationHistory", 0, "educationalAttended"]}>
                <Input placeholder="Enter institution name" />
                </Form.Item>
                <Form.Item label="Year of Graduation" name={["educationHistory", 0, "yearOfGraduation"]}>
                <Input placeholder="Enter graduation year" />
                </Form.Item>
            </div>
            
            <h4 className="text-md font-medium text-gray-700 mt-6 mb-4">Previous Employers:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="Employer Name" name="employerName">
                <Input placeholder="Enter employer name" />
                </Form.Item>
                <Form.Item label="Start Date" name= "startDate">
                <DatePicker placeholder="Select start date" className="w-full" />
                </Form.Item>
                <Form.Item label="End Date" name= "endDate">
                <DatePicker placeholder="Select end date" className="w-full" />
                </Form.Item>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-6 mb-4">Matrimony Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Marital Status" name="maritalStatus">
              <Select placeholder="Marital Status">
                <Option value="Single">Single</Option>
                <Option value="Married">Married</Option>
                <Option value="Divorced">Divorced</Option>
                <Option value="Widowed">Widowed</Option>
              </Select>
              </Form.Item>
                <Form.Item label="Religion & Caste" name="religionCaste">
                    <Select placeholder="Select religion & caste"  />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Height & Weight" name="heightWeight">
                <Input placeholder="Enter height & weight" />
                </Form.Item>
                <Form.Item label="Dietary Preferences" name="dietaryPreferences">
                <Input placeholder="Enter dietary preferences" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Hobbies & Interests" name="hobbiesAndInterests">
                <Input placeholder="Enter hobbies and interests" />
                </Form.Item>
            </div>
            <h4 className="text-md font-medium text-gray-700 mt-6 mb-4">Family Details:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Parents' Occupation" name="parentsOccupation">
                <Input placeholder="Enter parents' occupation" />
                </Form.Item>
                <Form.Item label="Siblings" name="siblings">
                <Input placeholder="Enter number of siblings" />
                </Form.Item>
            </div>
            <h4 className="text-md font-medium text-gray-700 mt-6 mb-4">Preferred Partner Details:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Marital Status" name="maritalStatus">
                <Input placeholder="Enter preferred marital status" />
                </Form.Item>
                <Form.Item label="Age Range" name="ageRange">
                <Input placeholder="Enter preferred age range" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Height" name="height">
                <Input placeholder="Enter preferred height" />
                </Form.Item>
                <Form.Item label="Religion & Caste" name="religionCaste">
                <Input placeholder="Enter preferred religion & caste" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Location" name="location">
                <Input placeholder="Enter preferred location" />
                </Form.Item>
                <Form.Item label="Preferences" name="preferences">
                <Input placeholder="Enter additional preferences" />
                </Form.Item>
            </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button type="primary" htmlType="submit" loading={loading} className="px-6 py-2 text-lg">
            Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
    </div>
    </div>
    </Suspense>
  );
};

export default EditUser;
