import './style.css';

const IconN = ({ iconName }) => {
   return (
      <div className="ii">
         <i className={`bi bi-${iconName} `} style={{ fontSize: 30 }} />
      </div>
   );
};

export default IconN;
