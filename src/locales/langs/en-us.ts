const local: App.I18n.Schema = {
  system: {
    title: 'SoybeanAdmin',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    confirmDeletes: 'Do you confirm the deletion of the {count} files selected?',
    confirmDeleteWhat: 'Are you sure you want to delete {name}?',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modifyPassword: 'Modify password',
    generator: 'Generator',
    forcedLogout: 'Forced logout',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    export: 'Export',
    exportSuccess: 'Export Success',
    confirmExport: 'Are you sure you want to export',
    copy: 'Copy',
    copySuccess: 'Copy success',
    copyNotSupported: "Your browser don't support Clipboard API",
    dataList: 'Data list',
    list: 'List',
    upload: 'Upload',
    uploadSuccess: 'Upload success',
    uploadCancel: 'Cancel upload',
    downlond: 'Download',
    downlondSuccess: 'Download success',
    downlondCancel: 'Cancel download',
    profile: 'Profile',
    about: 'About',
    unkonw: 'Unkonw',
    default: 'Default',
    bulkOperations: 'Bulk operate',
    bulkOperationsCancel: 'Cancel bulk operate',
    operateFail: 'Operate fail',
    operateSuccess: 'Operate success',
    confirmOperations: 'Are you sure you want {name} ?',
    preview: 'Preview',
    previewFile: 'File Preview',
    view: {
      label: 'View',
      table: 'Table',
      board: 'Board',
      list: 'List',
      grid: 'Grid',
      card: 'Card',
      album: 'Album',
      form: 'Form',
      calendar: 'Calendar'
    },
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    enable: {
      enabled: 'Enabled',
      disabled: 'Disabled'
    },
    status: {
      label: 'Status',
      succeed: 'Succeed',
      failed: 'Failed'
    },
    gender: {
      label: 'Gender',
      male: 'Male',
      female: 'Female',
      unknow: 'Unknow'
    },
    read: {
      read: 'Read',
      unread: 'Unread',
      unknow: 'Unknow',
      viewMore: 'More >',
      allRead: 'All Read'
    },
    bind: {
      bind: 'Bind',
      unbind: 'Unbind',
      bindWhat: 'Bind {name}',
      bound: 'Bound',
      unbound: 'Unbound',
      bindSuccess: 'Bind success',
      unbindSuccess: 'Unbind success'
    },
    setting: {
      label: 'Setting',
      isSet: 'Is Setting',
      isNotSet: 'Not Setting'
    }
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    grayscale: 'Grayscale',
    colourWeakness: 'Colour Weakness',
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode',
      reverseHorizontalMix: 'Reverse first level menus and child level menus position'
    },
    recommendColor: 'Apply Recommended Color Algorithm',
    recommendColorDesc: 'The recommended color algorithm refers to',
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tab Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    watermark: {
      visible: 'Watermark Full Screen Visible',
      text: 'Watermark Text'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    },
    space: {
      tableTitle: 'Table Space',
      themeTitle: 'Theme Space',
      tableSize: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      },
      themeSize: {
        small: 'Small',
        medium: 'medium',
        large: 'Large'
      }
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    'iframe-page': 'Iframe',
    home: 'Home',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    monitor: 'System Monitor',
    monitor_log: 'System Log',
    monitor_online: 'Online User',
    about: 'About',
    profile: 'User Profile',
    system: 'System Manage',
    system_config: 'System Config',
    system_dept: 'Department Manage',
    system_dict: 'Dict Manage',
    system_file: 'File Manage',
    system_menu: 'Menu Manage',
    system_notice: 'Notice Manage',
    system_role: 'Role Manage',
    system_storage: 'Storage Manage',
    system_user: 'User Manage',
    tool: 'System Tool',
    tool_generator: 'Code Generator',
    expired: 'Password Expired',
    message: 'Message',
    system_dict_item: 'Dict Item Manage',
    system_notice_add: 'Dict Add',
    system_notice_detail: 'Dict View',
    project: 'About Project',
    schedule: 'Schedule',
    schedule_job: 'Schedule Manage',
    schedule_log: 'Schedule Log'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        codeExpired: 'Expired, Please refresh',
        passwordOldPlaceholder: 'Please enter old password',
        passwordNewPlaceholder: 'Please enter new password',
        confirmNewPasswordPlaceholder: 'Please enter new password again',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        modifyNotify: 'Password expired, please modify new password',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        sendCodeFail: 'Verification code sent failed',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      modifyPwd: {
        title: 'Modify Password'
      }
    },
    about: {
      title: 'About',
      introduction: `SoybeanAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. SoybeanAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      branchDesc:
        'For the convenience of everyone in developing and updating the merge, we have streamlined the code of the main branch, only retaining the homepage menu, and the rest of the content has been moved to the example branch for maintenance. The preview address displays the content of the example branch.',
      greeting: 'Good morning, {userName}, today is another day full of vitality!',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      notice: 'Notice',
      message: 'Message',
      todo: 'Todo',
      downloadCount: 'Download Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    manage: {
      common: {
        status: {
          enable: 'Enable',
          disable: 'Disable',
          unknow: 'Unknow'
        }
      },
      role: {
        title: 'Role List',
        roleName: 'Role Name',
        roleCode: 'Role Code',
        roleStatus: 'Role Status',
        roleDesc: 'Role Description',
        menuAuth: 'Menu Auth',
        buttonAuth: 'Button Auth',
        form: {
          roleName: 'Please enter role name',
          roleCode: 'Please enter role code',
          roleStatus: 'Please select role status',
          roleDesc: 'Please enter role description'
        },
        addRole: 'Add Role',
        editRole: 'Edit Role'
      },
      user: {
        title: 'User List',
        userName: 'User Name',
        userGender: 'Gender',
        nickName: 'Nick Name',
        userPhone: 'Phone Number',
        userEmail: 'Email',
        userStatus: 'User Status',
        userRole: 'User Role',
        form: {
          userName: 'Please enter user name',
          userGender: 'Please select gender',
          nickName: 'Please enter nick name',
          userPhone: 'Please enter phone number',
          userEmail: 'Please enter email',
          userStatus: 'Please select user status',
          userRole: 'Please select user role'
        },
        addUser: 'Add User',
        editUser: 'Edit User'
      },
      menu: {
        home: 'Home',
        title: 'Menu List',
        id: 'ID',
        parentId: 'Parent ID',
        menuType: 'Menu Type',
        menuName: 'Menu Name',
        routeName: 'Route Name',
        routePath: 'Route Path',
        pathParam: 'Path Param',
        layout: 'Layout Component',
        page: 'Page Component',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        localIcon: 'Local Icon',
        iconTypeTitle: 'Icon Type',
        order: 'Order',
        constant: 'Constant',
        keepAlive: 'Keep Alive',
        href: 'Href',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        query: 'Query Params',
        button: 'Button',
        buttonCode: 'Button Code',
        buttonDesc: 'Button Desc',
        menuStatus: 'Menu Status',
        form: {
          home: 'Please select home',
          menuType: 'Please select menu type',
          menuName: 'Please enter menu name',
          routeName: 'Please enter route name',
          routePath: 'Please enter route path',
          pathParam: 'Please enter path param',
          page: 'Please select page component',
          layout: 'Please select layout component',
          i18nKey: 'Please enter i18n key',
          icon: 'Please enter iconify name',
          localIcon: 'Please enter local icon name',
          order: 'Please enter order',
          keepAlive: 'Please select whether to cache route',
          href: 'Please enter href',
          hideInMenu: 'Please select whether to hide menu',
          activeMenu: 'Please select route name of the highlighted menu',
          multiTab: 'Please select whether to support multiple tabs',
          fixedInTab: 'Please select whether to fix in the tab',
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          queryKey: 'Please enter route parameter Key',
          queryValue: 'Please enter route parameter Value',
          button: 'Please select whether it is a button',
          buttonCode: 'Please enter button code',
          buttonDesc: 'Please enter button description',
          menuStatus: 'Please select menu status'
        },
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        addChildMenu: 'Add Child Menu',
        type: {
          directory: 'Directory',
          menu: 'Menu'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
      log: {
        title: 'Log List',
        logType: 'Log type',
        logUser: 'Log user',
        logDetailType: 'Log deatil',
        requestUrl: 'Request url',
        createTime: 'Create time',
        responseCode: 'Response code',
        form: {
          logType: 'Please select Log type',
          logUser: 'Please enter Log user',
          logDetailType: 'Please select Log deatil',
          requestUrl: 'Please enter Request url',
          createTime: 'Please select Create time',
          responseCode: 'Please enter Response code'
        },
        viewLog: 'View Log',
        logDetailTypes: {
          SystemStart: 'System start',
          SystemStop: 'System stop',
          UserLoginSuccess: 'User login success',
          UserAuthRefreshTokenSuccess: 'User authentication refresh token success',
          UserLoginGetUserInfo: 'User login get user info',
          UserLoginUserNameVaild: 'User login username valid',
          UserLoginErrorPassword: 'User login error password',
          UserLoginForbid: 'User login forbidden',
          ApiGetList: 'API get list',
          ApiGetTree: 'API get tree',
          ApiRefresh: 'API refresh',
          ApiGetOne: 'API get one',
          ApiCreateOne: 'API create one',
          ApiUpdateOne: 'API update one',
          ApiDeleteOne: 'API delete one',
          ApiBatchDelete: 'API batch delete',
          MenuGetList: 'Menu get list',
          MenuGetTree: 'Menu get tree',
          MenuGetPages: 'Menu get pages',
          MenuGetButtonsTree: 'Menu get buttons tree',
          MenuGetOne: 'Menu get one',
          MenuCreateOne: 'Menu create one',
          MenuUpdateOne: 'Menu update one',
          MenuDeleteOne: 'Menu delete one',
          MenuBatchDeleteOne: 'Menu batch delete',
          RoleGetList: 'Role get list',
          RoleGetMenus: 'Role get menus',
          RoleUpdateMenus: 'Role update menus',
          RoleGetButtons: 'Role get buttons',
          RoleUpdateButtons: 'Role update buttons',
          RoleGetApis: 'Role get APIs',
          RoleUpdateApis: 'Role update APIs',
          RoleGetOne: 'Role get one',
          RoleCreateOne: 'Role create one',
          RoleUpdateOne: 'Role update one',
          RoleDeleteOne: 'Role delete one',
          RoleBatchDeleteOne: 'Role batch delete',
          UserGetList: 'User get list',
          UserGetOne: 'User get one',
          UserCreateOne: 'User create one',
          UserUpdateOne: 'User update one',
          UserDeleteOne: 'User delete one',
          UserBatchDeleteOne: 'User batch delete'
        },
        logTypes: {
          ApiLog: 'Api log',
          UserLog: 'User log',
          AdminLog: 'Admin log',
          SystemLog: 'System log'
        }
      },

      api: {
        title: 'API List',
        path: 'Path',
        method: 'Method',
        summary: 'Summary',
        tags: 'Tags',
        status: 'Status',
        form: {
          path: 'Please enter path',
          method: 'Please select method',
          summary: 'Please enter summary',
          tags: 'Please enter tags',
          status: 'Please select user status'
        },
        addApi: 'Add API',
        editApi: 'Edit API',
        methods: {
          GET: 'GET',
          POST: 'POST',
          PUT: 'PUT',
          PATCH: 'PATCH',
          DELETE: 'DELETE'
        }
      }
    },
    profile: {
      base: {
        title: 'Base Information',
        username: 'Username',
        phone: 'Phone',
        mail: 'Email',
        dept: 'Department',
        role: 'Role',
        registeredIn: 'Registered In ',
        notYet: 'Not yet ',
        edit: {
          title: 'Edit the basic information',
          nickname: 'Nickname',
          nicknamePlaceholder: 'Please enter a nickname'
        }
      },
      security: {
        title: 'Security Setting',
        phone: 'Security phone',
        mail: 'Security mail',
        password: 'Security password',
        accountTip: '{prefix} can be used for login, authentication, password retrieval, and notification receiving',
        passwordUpdateTip: 'For the security of your account, it is recommended to change your password regularly',
        passwordSettingTip: 'Please set a password, you can log in with account + password'
      },
      social: {
        title: 'Social Account',
        bind: 'Unbound',
        unbind: 'After binding',
        bindTip: '{prefix}, you can log in via {name}'
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    },
    phoneOrEmail: {
      required: 'Please enter phone or email',
      invalid: 'Phone or email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin',
    expandList: 'Expand List',
    collapseList: 'Collapse List',
    notifications: 'Notifications'
  },
  datatable: {
    itemCount: 'Total {total} items'
  }
};

export default local;
