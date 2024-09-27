import Image from "next/image";
import styles from "./page.module.css";
import {eventWorker, webhookWorker, retryWorker} from "@/lib/handler";
export default function Home() {

    // Redis queue workers
    // Updating these workers may require reloading the project manually!

    eventWorker.on('failed', (job, err) => {
        console.log(`Event Worker job: ${job.id} has failed with ${err.message}`);
    });

    webhookWorker.on('failed', (job, err) => {
        console.log(`Webhook Worker job: ${job.id} has failed with ${err.message}`);
    });

    retryWorker.on('failed', (job, err) => {
        console.log(`Retry Worker job: ${job.id} has failed with ${err.message}`);
    });

  return (
    <div className={styles.page}>
      <p1>JAX Webhook Workshop 2024</p1>
    </div>
  );
}
