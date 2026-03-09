from db import engine

# Testa anslutningen
try:
    connection = engine.connect()
    print("✅ Anslutningen till databasen fungerar!")
    connection.close()
except Exception as e:
    print("❌ Kunde inte ansluta till databasen:", e)
