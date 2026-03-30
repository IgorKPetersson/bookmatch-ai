from db import engine

# Test the commnection
try:
    connection = engine.connect()
    print("✅ Anslutningen till databasen fungerar!")
    connection.close()
except Exception as e:
    print("❌ Kunde inte ansluta till databasen:", e)
