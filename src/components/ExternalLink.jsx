export default function ExternalLink({ href, children, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
