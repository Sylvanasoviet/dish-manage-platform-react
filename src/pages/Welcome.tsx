import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Card, Typography, Alert } from 'antd';
<<<<<<< HEAD
import CoolInput from '@/components/CoolInput/index';
=======
>>>>>>> 63b6c5b699864eb112ef29bb2c55d28593013d6f

import styles from './Welcome.less';

type menuProps = {
  menulist: string[]
}

const CodePreview: React.FC<menuProps> = ({ menulist }) => {
  let funcList = {}
  if (menulist) {
    funcList = menulist.map((item, index) => <Typography.Text key={item}>{`${index + 1}-${item}`}<br /></Typography.Text>);
  }
  return (
    <pre className={styles.pre}>
      <code>
        <Typography.Text>{funcList}</Typography.Text>
      </code>
    </pre>
  )
}

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card style={{ background: '#333' }}>
      <Alert
        message="CoolIput展示"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <CoolInput />
    </Card>
    <Card>
      <Alert
        message="欢迎使用管理系统"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <br />
      <Typography.Text strong>
        <a>
          <FormattedMessage
            id="app.welcome.dishesIntroduce"
            defaultMessage="菜品管理模块，用于新增菜品、修改菜品、删除菜品等操作。"
          />
        </a>
      </Typography.Text>
      <CodePreview menulist={[
        '1231231231231233',
        '22312312123',
        '12123123123',
        '1231231232132123',
        '1231312323123',
        '12312123233123',
        '1231231231123',
      ]}/>
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <a>
          <FormattedMessage id="app.welcome.showIntroduce" defaultMessage="菜品展示控制管理，用于编辑菜品展示页面" />
        </a>
      </Typography.Text>
      <CodePreview menulist={[
        '1231231231231233',
        '22312312123',
        '12123123123',
        '1231231232132123',
        '1231312323123',
        '12312123233123',
        '1231231231123',
      ]}/>
    </Card>
    {/* <p style={{ textAlign: 'center', marginTop: 24 }}>
      Want to add more pages? Please refer to{' '}
      <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
        use block
      </a>
      。
    </p> */}
  </PageHeaderWrapper>
);
