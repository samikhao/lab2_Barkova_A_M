import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import styles from "./styles/layout.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
