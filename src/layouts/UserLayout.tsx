import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
// import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

// import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
// import bannerActive from '@/utils/borderLight'
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });

  // bannerActive(document.getElementById('login-window'));

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>


      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <canvas id="login-window" className={styles.borderLight}></canvas>

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              {/* <Link to="/"> */}
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>管理系统</span>
              {/* </Link> */}
            </div>
            <div className={styles.desc}>管理系统用于各种管理</div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
