export default function DeveloperInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel devinfo-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-icon" onClick={onClose}>
          ×
        </button>

       
        <div className="devinfo-header">
          <h2 className="devinfo-name">Shaikh Ameen</h2>
          <p className="devinfo-title">
            Software Associate – Frontend Developer
          </p>
        </div>

       
        <div className="devinfo-contact">
          <a href="mailto:imameen36@gmail.com">📧 imameen36@gmail.com</a>
          <a href="tel:+918625802122">📞 +91 8625802122</a>
          <a href="https://www.linkedin.com/in/ameen-shaikh-972b2b233">
            🔗 linkedin.com/in/ameen-shaikh-972b2b233
          </a>
          <a href="https://github.com/skameen36">💻 github.com/skameen36</a>
          <span>📍 Amravati, Maharashtra</span>
        </div>

       
        <div className="devinfo-body">
          <h3>Key Contributions</h3>
          <ul>
            <li>Set up development environment (VS Code, Node.js, tooling).</li>
            <li>Built responsive UIs with React, HTML, CSS, Tailwind.</li>
            <li>
              Implemented state management via React Hooks (useState,
              useEffect).
            </li>
            <li>Created reusable components: forms, modals, tables, inputs.</li>
            <li>
              Applied pagination & filtering for efficient list rendering.
            </li>
            <li>Integrated React Router: nested layouts, route protection.</li>
            <li>Leveraged lazy loading to optimize bundle size.</li>
            <li>Managed REST API data flow and seamless UI interaction.</li>
            <li>
              Practiced conditional rendering, form validation, clean
              architecture.
            </li>
            <li>
              Participated in Agile cycles: testing, debugging, code reviews.
            </li>
          </ul>
        </div>

       
        <div className="devinfo-footer">
          <span>
            <strong>Total Experience:</strong> 2 years 5 months
          </span>
        </div>
      </div>
    </div>
  );
}
