<template>
  <el-form :model="loginForm" ref="loginForm">
    <el-form-item label="登录" prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入你的账号" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" placeholder="请输入你的密码" show-password type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </el-form-item>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "https://app.larksuite.com.tw/api/src/login.php",
          {
            username: this.loginForm.username,
            password: this.loginForm.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.jwt) {
          this.$emit("login", response.data.jwt);
        } else {
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        console.log(error);
        this.errorMessage = "An error occurred during login.";
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 100%;
  margin: 0 auto;
}

.login-button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.login-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.error-container {
  margin-top: 15px;
  text-align: center;
}

.error {
  color: #f56c6c;
  font-size: 14px;
  background-color: #fef0f0;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
}
</style>
