import { useRef } from 'react';
import { useBuildOnView } from './useBuildOnView';
import './build.css';

export default function BuildScope({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  useBuildOnView(ref);
  return (
    <Tag ref={ref} className={`build-scope ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
