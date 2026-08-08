/**
 * API Connection Test Suite
 *
 * This file contains functions to test API connectivity with the backend.
 * Run these tests to verify that the frontend is properly connected to the backend.
 */

import { authService, userService, emergencyContactService, reportService } from './index';

// Test data
const testUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@margdarshak.com',
  password: 'Test123456!',
  phone_number: '+1234567890',
};

/**
 * Test 1: Backend Health Check
 */
export async function testBackendHealth() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:8000'}/`);
    const data = await response.json();
    console.log('✅ Backend Health Check:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend Health Check Failed:', error);
    return { success: false, error };
  }
}

/**
 * Test 2: User Registration
 */
export async function testRegister() {
  try {
    const result = await authService.register(testUser);
    console.log('✅ Registration Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Registration Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 3: User Login
 */
export async function testLogin() {
  try {
    const result = await authService.login(testUser.email, testUser.password);
    console.log('✅ Login Success:', {
      token_type: result.token_type,
      has_access_token: !!result.access_token,
      has_refresh_token: !!result.refresh_token,
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Login Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 4: Get User Profile (requires login)
 */
export async function testGetProfile() {
  try {
    const result = await userService.getProfile();
    console.log('✅ Get Profile Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Get Profile Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 5: Update User Profile (requires login)
 */
export async function testUpdateProfile() {
  try {
    const result = await userService.updateProfile({
      first_name: 'Updated',
      last_name: 'Name',
    });
    console.log('✅ Update Profile Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Update Profile Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 6: Get Report Categories (requires login)
 */
export async function testGetCategories() {
  try {
    const result = await reportService.getCategories();
    console.log('✅ Get Categories Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Get Categories Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 7: Create Emergency Contact (requires login)
 */
export async function testCreateEmergencyContact() {
  try {
    const result = await emergencyContactService.createContact({
      name: 'Emergency Contact',
      phone_number: '+9876543210',
    });
    console.log('✅ Create Emergency Contact Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Create Emergency Contact Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 8: Get Emergency Contacts (requires login)
 */
export async function testGetEmergencyContacts() {
  try {
    const result = await emergencyContactService.getContacts();
    console.log('✅ Get Emergency Contacts Success:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Get Emergency Contacts Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Test 9: Logout
 */
export async function testLogout() {
  try {
    await authService.logout();
    console.log('✅ Logout Success');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Logout Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Run All Tests (Sequential)
 */
export async function runAllTests() {
  console.log('\n🧪 Starting API Connection Tests...\n');

  const results = {
    health: await testBackendHealth(),
    register: await testRegister(),
    login: await testLogin(),
    profile: await testGetProfile(),
    updateProfile: await testUpdateProfile(),
    categories: await testGetCategories(),
    createContact: await testCreateEmergencyContact(),
    getContacts: await testGetEmergencyContacts(),
    logout: await testLogout(),
  };

  const successCount = Object.values(results).filter((r) => r.success).length;
  const totalCount = Object.keys(results).length;

  console.log(`\n✅ Tests Passed: ${successCount}/${totalCount}`);
  console.log(`❌ Tests Failed: ${totalCount - successCount}/${totalCount}\n`);

  return results;
}