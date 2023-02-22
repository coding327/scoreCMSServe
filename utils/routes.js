

const routes = [
  {
    path: '/home',
    name: 'home',
    text: "首页",
    role: 1,
    //icon:'markRaw(HomeOutlined)',
    component: () => import('@/views/Home/Home.vue')
  },

  {
    path: '/grade',
    name: 'grade',
    role: 1,
    text: "成绩管理",
    //icon:'markRaw(ProfileOutlined)',
    children: [
      // 项目成绩管理
      {
        path: '/grade/my',
        name: 'grade-my',
        component: () => import('@/views/Grade/GradeMy.vue'),
        role: 1,
        text: "我的成绩",
        //icon:'markRaw(ProfileOutlined)',
        max: 1,  // 比我大看不到了 
      },
      {
        path: '/grade/list',
        name: 'grade-list',
        component: () => import('@/views/Grade/GradeList.vue'),
        role: 1,
        text: "成绩列表",
        //icon:'markRaw(ProfileOutlined)',
      },
      {
        path: '/grade/add',
        name: 'grade-add',
        component: () => import('@/views/Grade/GradeAdd.vue'),
        role: 1,
        text: "提交成绩",
        //icon:'markRaw(ProfileOutlined)',
        max: 1,
      },
      {
        path: '/grade/data',
        name: 'grade-data',
        component: () => import('@/views/Grade/GradeData.vue'),
        role: 1,
        text: "成绩分析",
        //icon:'markRaw(ProfileOutlined)',
      },
      {
        path: '/grade/update/:id',
        name: 'grade-update',
        component: () => import('@/views/Grade/GradeUpdate.vue'),
        role: 1,
        noshow: true,
        //icon:'markRaw(ProfileOutlined)',
      },
      {
        path: '/grade/detail/:id',
        name: 'grade-detail',
        component: () => import('@/views/Grade/GradeView.vue'),
        role: 1,
        noshow: true,
        //icon:'markRaw(ProfileOutlined)',
      },
    ]
  },

  {
    path: '/anno',
    name: 'anno',
    role: 1,
    text: "公告管理",
    //icon:'markRaw(DesktopOutlined)',
    children: [
      {
        path: '/anno/list',
        name: 'anno-list',
        component: () => import('@/views/Anno/AnnoList.vue'),
        role: 1,
        text: "公告列表",
        //icon:'markRaw(DesktopOutlined)',
      },
      {
        path: '/anno/add',
        name: 'anno-add',
        component: () => import('@/views/Anno/AnnoAdd.vue'),
        role: 2,
        text: "发布公告",
        //icon:'markRaw(DesktopOutlined)',
        max: 5,
      },
      {
        path: '/anno/update/:id',
        name: 'anno-update',
        component: () => import('@/views/Anno/AnnoUpdate.vue'),
        role: 1,
        noshow: true,
        //icon:'markRaw(DesktopOutlined),'
      },
    ]
  },

  {
    path: '/edu',
    name: 'edu',
    role: 4,
    text: "教务管理",
    //icon:'markRaw(StarOutlined)',
    children: [
      {
        path: '/edu/subject',
        name: 'edu-subject',
        component: () => import('@/views/Edu/Subject.vue'),
        role: 4,
        text: "学科管理",
        //icon:'markRaw(StarOutlined)',
      },
      {
        path: '/edu/class',
        name: 'edu-class',
        component: () => import('@/views/Edu/ClassOpen.vue'),
        role: 4,
        text: "班级管理",
        //icon:'markRaw(StarOutlined)',
      },

      {
        path: '/edu/student',
        name: 'edu-student',
        component: () => import('@/views/Edu/StudentOpen.vue'),
        role: 4,
        text: "学员管理",
        //icon:'markRaw(StarOutlined)',
      },
    ]
  },

  {
    path: '/user',
    name: 'user',
    role: 2,
    text: "用户管理",
    //icon:'markRaw(UserOutlined)',
    children: [
      // 用户管理
      {
        path: '/user/add',
        name: 'user-add',
        component: () => import('@/views/User/UserAdd.vue'),
        role: 2,
        text: "用户新增",
        //icon:'markRaw(UserOutlined)',
      },
      {
        path: '/user/list',
        name: 'user-list',
        component: () => import('@/views/User/UserList.vue'),
        role: 2,
        text: "用户列表",
        //icon:'markRaw(UserOutlined)',
      },
    ]
  },

  {
    path: '/role',
    name: 'role',
    role: 5,
    text: "角色管理",
    //icon:'markRaw(LockOutlined)',
    children: [
      // 角色管理
      {
        path: '/role/list',
        name: 'role-list',
        component: () => import('@/views/Role/RoleList.vue'),
        role: 5,
        text: "角色列表",
        //icon:'markRaw(LockOutlined)',
      },
      {
        path: '/role/data',
        name: 'role-data',
        component: () => import('@/views/Role/RoleData.vue'),
        role: 5,
        text: "角色分析",
        //icon:'markRaw(LockOutlined)',
      },
    ]
  },

  {
    path: '/advise',
    name: 'advise',
    role: 1,
    text: "意见管理",
    //icon:'markRaw(FileSearchOutlined)',
    children: [
      // 意见管理
      {
        path: '/advise/add',
        name: 'advise-add',
        component: () => import('@/views/Advise/AdviseAdd.vue'),
        role: 1,
        text: "意见新增",
        //icon:'markRaw(FileSearchOutlined)',
      },
      {
        path: '/advise/list',
        name: 'advise-list',
        component: () => import('@/views/Advise/AdviseList.vue'),
        role: 1,
        text: "意见列表",
        //icon:'markRaw(FileSearchOutlined)',
      },
      {
        path: '/advise/update/:id',
        name: 'advise-update',
        component: () => import('@/views/Advise/AdviseUpdate.vue'),
        role: 1,
        text: "",
        noshow: true,
        //icon:'markRaw(FileSearchOutlined)',
      },
      {
        path: '/advise/detail/:id',
        name: 'advise-detail',
        component: () => import('@/views/Advise/AdviseDetail.vue'),
        role: 1,
        text: "",
        noshow: true,
        //icon:'markRaw(FileSearchOutlined)',
      },
    ]
  },
  {
    path: '/routeset',
    name: 'routeset',
    text: "路由管理",
    role: 1,
    //icon:'markRaw(SettingOutlined)',
    component: () => import('@/views/Set/SetRoute.vue'),
    children: [
      {
        path: '/routeset',
        name: 'routeset',
        text: "路由管理",
        role: 1,
        //icon:'markRaw(SettingOutlined)',
        component: () => import('@/views/Set/SetRoute.vue'),
        children: [
          {
            path: '/routeset',
            name: 'routeset',
            text: "路由管理",
            role: 1,
            //icon:'markRaw(SettingOutlined)',
            component: () => import('@/views/Set/SetRoute.vue'),
            children: [
              {
                path: '/routeset',
                name: 'routeset',
                text: "路由管理",
                role: 1,
                //icon:'markRaw(SettingOutlined)',
                component: () => import('@/views/Set/SetRoute.vue'),
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/mine',
    name: 'mine',
    text: "个人中心",
    role: 1,
    //icon:'markRaw(CalendarOutlined)',
    component: () => import('@/views/Mine/Mine.vue')
  },
]

module.exports = routes